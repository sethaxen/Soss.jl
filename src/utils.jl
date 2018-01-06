function parameters(model)
    params :: Vector{Symbol} = []
    body = postwalk(model) do x
        if @capture(x, v_ ~ dist_)
            push!(params, v)
        else x
        end
    end
    return params
end

function supports(model)
    supps = Dict{Symbol, Any}()
    postwalk(model) do x
        if @capture(x, v_ ~ dist_)
            supps[v] = support(eval(dist))
        else x
        end
    end
    return supps
end


"""
    observe(model, var)
"""
function observe(model, v :: Symbol)
    if @capture(model, function(args__) body_ end)
        if !(v in args)
            push!(args, v)
        end
    else 
        args = [v]
    end 

    body = postwalk(body) do x 
        if @capture(x, v0_ ~ dist_) && v0 == v
            quote 
                $v <~ $dist
            end
        else 
            x
        end
    end

    fQuoted = Expr(:function, tuplify(args), body)

    return prettify(fQuoted)
end 

function observe(model, vs :: Vector{Symbol})
    if @capture(model, function(args__) body_ end)
        args = union(args, vs)
    else 
        args = vs
    end 

    body = postwalk(body) do x 
        if @capture(x, v_ ~ dist_) && v in vs
            quote 
                $v <~ $dist
            end
        else 
            x
        end
    end

    fQuoted = Expr(:function, tuplify(args), body)

    return prettify(fQuoted)
end 


function xform(R, v, supp)
    @assert typeof(supp) == RealInterval
    lo = supp.lb
    hi = supp.ub
    body = if (lo,hi) == (-Inf, Inf)  # no transform needed in this case
        quote
            $v = $R
        end
    elseif (lo,hi) == (0.0, Inf)   
        quote
            $v = softplus($R)
            ℓ += abs($v - $R)
        end
    elseif (lo, hi) == (0.0, 1.0)
        quote 
            $v = logistic($R)
            ℓ += log($v * (1 - $v))
        end  
    else 
        throw(error("Transform not implemented"))                            
    end

    return body
end


function logdensity(model)
    j = 0
    body = postwalk(model) do x
        if @capture(x, v_ ~ dist_)
            j += 1
            supp = support(eval(dist)) 
            @assert (typeof(supp) == RealInterval) "Sampled values must have RealInterval support (for now)"
            quote
                $(xform(:(θ[$j]), v, supp ))
                ℓ += logpdf($dist, $v)
            end
        elseif @capture(x, v_ <~ dist_) 
            quote
                ℓ += logpdf($dist, $v)
            end
        else x
        end
    end
    fQuoted = quote
        function(θ::SVector{$j,Float64}, DATA)
            ℓ = 0.0
            $body
            return ℓ
        end
    end

    return prettify(fQuoted)
end

