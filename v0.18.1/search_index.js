var documenterSearchIndex = {"docs":
[{"location":"api/","page":"Soss API","title":"Soss API","text":"CurrentModule = Soss","category":"page"},{"location":"api/#API","page":"Soss API","title":"API","text":"","category":"section"},{"location":"api/","page":"Soss API","title":"Soss API","text":"","category":"page"},{"location":"api/","page":"Soss API","title":"Soss API","text":"Modules = [Soss]","category":"page"},{"location":"api/#Soss.AbstractModel","page":"Soss API","title":"Soss.AbstractModel","text":"AbstractModel{A,B,M,Args,Obs}\n\nGives an abstract type for all Soss models\n\nType variables ending in T are type-level representations used to reconstruct\n\nN gives the Names of arguments (each a Symbol) B gives the Body, as an Expr M gives the Module where the model is defined\n\n\n\n\n\n","category":"type"},{"location":"api/#Soss.Do-Tuple{Model, Vararg{Any, N} where N}","page":"Soss API","title":"Soss.Do","text":"Do(m, xs...)\n\nReturns a model transformed by adding xs... to arguments. The remainder of the body remains the same, consistent with Judea Pearl's \"Do\" operator. Unneeded arguments are trimmed.\n\nExamples\n\nm = @model (n, k) begin\n    β ~ Gamma()\n    α ~ Gamma()\n    θ ~ Beta(α, β)\n    x ~ Binomial(n, θ)\n    z ~ Binomial(k, α / (α + β))\nend;\nDo(m, :θ)\n\n# output\n@model (n, k, θ) begin\n        β ~ Gamma()\n        α ~ Gamma()\n        x ~ Binomial(n, θ)\n        z ~ Binomial(k, α / (α + β))\n    end\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss._unwrap_type-Tuple{Type{var\"#s1\"} where var\"#s1\"<:Type}","page":"Soss API","title":"Soss._unwrap_type","text":"we use this to avoid introduce static type parameters for generated functions\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss.after-Tuple{Model, Vararg{Any, N} where N}","page":"Soss API","title":"Soss.after","text":"after(m::Model, xs...; strict=false)\n\nTransforms m by moving xs to arguments. If strict=true, only descendants of xs are retained in the body. Otherwise, the remaining variables in the body are unmodified. Unused arguments are trimmed.\n\npredictive(m::Model, xs...) = after(m, xs..., strict = true)\n\nDo(m::Model, xs...) = after(m, xs..., strict = false)\n\nExample\n\nm = @model (n, k) begin\n    β ~ Gamma()\n    α ~ Gamma()\n    θ ~ Beta(α, β)\n    x ~ Binomial(n, θ)\n    z ~ Binomial(k, α / (α + β))\nend;\nSoss.after(m, :α)\n\n# output\n@model (n, k, α) begin\n        β ~ Gamma()\n        θ ~ Beta(α, β)\n        x ~ Binomial(n, θ)\n        z ~ Binomial(k, α / (α + β))\n    end\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss.before-Tuple{Model, Vararg{Any, N} where N}","page":"Soss API","title":"Soss.before","text":"before(m::Model, xs...; inclusive=true, strict=true)\n\nTransforms m by retaining all ancestors of any of xs if strict=true; if strict=false, retains all variables that are not descendants of any xs. Note that adding more variables to xs cannot result in a larger model. If inclusive=true, xs is considered to be an ancestor of itself and is always included in the returned Model. Unneeded arguments are trimmed.\n\nprune(m::Model, xs...) = before(m, xs..., inclusive = false, strict = false)\n\nprior(m::Model, xs...) = before(m, xs..., inclusive = true, strict = true)\n\nExamples\n\nm = @model (n, k) begin\n    β ~ Gamma()\n    α ~ Gamma()\n    θ ~ Beta(α, β)\n    x ~ Binomial(n, θ)\n    z ~ Binomial(k, α / (α + β))\nend;\nSoss.before(m, :θ, inclusive = true, strict = false)\n\n# output\n@model k begin\n        β ~ Gamma()\n        α ~ Gamma()\n        θ ~ Beta(α, β)\n        z ~ Binomial(k, α / (α + β))\n    end\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss.importanceSample","page":"Soss API","title":"Soss.importanceSample","text":"importanceSample(p(p_args), q(q_args), observed_data)\n\nSample from q, and weight the result to behave as if the sample were taken from p. For example,\n\n``` julia> p = @model begin     x ~ Normal()     y ~ Normal(x,1) |> iid(5) end;\n\njulia> q = @model μ,σ begin     x ~ Normal(μ,σ) end;\n\njulia> y = rand(p()).y;\n\njulia> importanceSample(p(),q(μ=0.0, σ=0.5), (y=y,)) Weighted(-7.13971.4 ,(x = -0.12280566635062592,) ````\n\n\n\n\n\n","category":"function"},{"location":"api/#Soss.likelihood-Tuple{Model, Vararg{Any, N} where N}","page":"Soss API","title":"Soss.likelihood","text":"likelihood(m, xs...)\n\nReturn a model with only the specified variables in the body. Required dependencies will be included as arguments.\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss.predictive-Tuple{Model, Vararg{Any, N} where N}","page":"Soss API","title":"Soss.predictive","text":"predictive(m, xs...)\n\nReturns a model transformed by adding xs... to arguments with a body containing only statements that depend on xs, or statements that are depended upon by children of xs through an open path. Unneeded arguments are trimmed.\n\nExamples\n\nm = @model (n, k) begin\n    β ~ Gamma()\n    α ~ Gamma()\n    θ ~ Beta(α, β)\n    x ~ Binomial(n, θ)\n    z ~ Binomial(k, α / (α + β))\nend;\npredictive(m, :θ)\n\n# output\n@model (n, θ) begin\n        x ~ Binomial(n, θ)\n    end\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss.prior-Tuple{Model, Vararg{Any, N} where N}","page":"Soss API","title":"Soss.prior","text":"prior(m, xs...)\n\nReturns the minimal model required to sample random variables xs.... Useful for extracting a prior distribution from a joint model m by designating xs... and the variables they depend on as the prior and hyperpriors.\n\nExample\n\nm = @model n begin\n    α ~ Gamma()\n    β ~ Gamma()\n    θ ~ Beta(α,β)\n    x ~ Binomial(n, θ)\nend;\nSoss.prior(m, :x)\n\n# output\n@model begin\n        β ~ Gamma()\n        α ~ Gamma()\n        θ ~ Beta(α, β)\n    end\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss.prune-Tuple{Model, Vararg{Any, N} where N}","page":"Soss API","title":"Soss.prune","text":"prune(m, xs...)\n\nReturns a model transformed by removing xs... and all variables that depend on xs.... Unneeded arguments are also removed.\n\nExamples\n\nm = @model n begin\n    α ~ Gamma()\n    β ~ Gamma()\n    θ ~ Beta(α,β)\n    x ~ Binomial(n, θ)\nend;\nprune(m, :θ)\n\n# output\n@model begin\n        β ~ Gamma()\n        α ~ Gamma()\n    end\n\nm = @model n begin\n    α ~ Gamma()\n    β ~ Gamma()\n    θ ~ Beta(α,β)\n    x ~ Binomial(n, θ)\nend;\nprune(m, :n)\n\n# output\n@model begin\n        β ~ Gamma()\n        α ~ Gamma()\n        θ ~ Beta(α, β)\n    end\n\n\n\n\n\n","category":"method"},{"location":"api/#Soss.withmeasures-Tuple{Model}","page":"Soss API","title":"Soss.withmeasures","text":"withmeasures(m::Model) -> Model\n\njulia> m = @model begin     σ ~ HalfNormal()     y ~ For(10) do j         Normal(0,σ)     end end;\n\njulia> mdists = Soss.withmeasures(m) @model begin         _σdist = HalfNormal()         σ ~ σdist         ydist = For(10) do j                 Normal(0, σ)             end         y ~ ydist     end\n\njulia> ydist = rand(mdists()).y_dist For{GeneralizedGenerated.Closure{function = (σ, M, j;) -> begin     M.Normal(0, σ) end,Tuple{Float64,Module}},Tuple{Int64},Normal{Float64},Float64}(GeneralizedGenerated.Closure{function = (σ, M, j;) -> begin     M.Normal(0, σ) end,Tuple{Float64,Module}}((0.031328640120683524, Main)), (10,))\n\njulia> rand(ydist) 10-element Array{Float64,1}:   0.03454891487870426   0.008832782323408313  -0.007395186925623771  -0.030669004243492004  -0.01728630026691135   0.011892877715064682   0.025576319363013512  -0.029323425779917773  -0.020502677724193594   0.04612690097957398\n\n\n\n\n\n","category":"method"},{"location":"misc/#Models-and-ConditionalModels","page":"Miscellaneous","title":"Models and ConditionalModels","text":"","category":"section"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"A Model in Soss","category":"page"},{"location":"misc/#Model-Combinators","page":"Miscellaneous","title":"Model Combinators","text":"","category":"section"},{"location":"misc/#Building-Inference-Algorithms","page":"Miscellaneous","title":"Building Inference Algorithms","text":"","category":"section"},{"location":"misc/#Inference-Primitives","page":"Miscellaneous","title":"Inference Primitives","text":"","category":"section"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"At its core, Soss is about source code generation. Instances of this are referred to as inference primitives, or simply \"primitives\". As a general rule, new primitives are rarely needed. A wide variety of inference algorithms can be built using what's provided.","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"To easily find all available inference primitives, enter Soss.source<TAB> at a REPL. Currently this returns this result:","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"julia> Soss.source\nsourceLogdensity         sourceRand            sourceXform\nsourceParticles      sourceWeightedSample","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"The general pattern is that a primitive sourceFoo specifies how code is generated for an inference function foo.","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"For more details on inference primitives, see the Internals section.","category":"page"},{"location":"misc/#Inference-Functions","page":"Miscellaneous","title":"Inference Functions","text":"","category":"section"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"An inference function is a function that takes a ConditionalModel as an argument, and calls at least one inference primitive (not necessarily directly). The wrapper around each primitive is a special case of this, but most inference functions work at a higher level of abstraction.","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"There's some variability , but is often of the form","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"foo(d::ConditionalModel, data::NamedTuple)","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"For example, advancedHMC uses TuringLang/AdvancedHMC.jl , which needs a logdensity and its gradient.","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"Most inference algorithms can be expressed in terms of inference primitives.","category":"page"},{"location":"misc/#Chain-Combinators","page":"Miscellaneous","title":"Chain Combinators","text":"","category":"section"},{"location":"misc/#Internals","page":"Miscellaneous","title":"Internals","text":"","category":"section"},{"location":"misc/#Models","page":"Miscellaneous","title":"Models","text":"","category":"section"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"struct Model{A,B}\n    args  :: Vector{Symbol}\n    vals  :: NamedTuple\n    dists :: NamedTuple\n    retn  :: Union{Nothing, Symbol, Expr}\nend","category":"page"},{"location":"misc/","page":"Miscellaneous","title":"Miscellaneous","text":"function sourceWeightedSample(_data)\n    function(_m::Model)\n\n        _datakeys = getntkeys(_data)\n        proc(_m, st :: Assign)     = :($(st.x) = $(st.rhs))\n        proc(_m, st :: Return)     = nothing\n        proc(_m, st :: LineNumber) = nothing\n\n        function proc(_m, st :: Sample)\n            st.x ∈ _datakeys && return :(_ℓ += logdensity($(st.rhs), $(st.x)))\n            return :($(st.x) = rand($(st.rhs)))\n        end\n\n        vals = map(x -> Expr(:(=), x,x),variables(_m))\n\n        wrap(kernel) = @q begin\n            _ℓ = 0.0\n            $kernel\n\n            return (_ℓ, $(Expr(:tuple, vals...)))\n        end\n\n        buildSource(_m, proc, wrap) |> flatten\n    end\nend\n","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"CurrentModule = Soss","category":"page"},{"location":"to-do-list/#To-Do-List","page":"To-Do List","title":"To-Do List","text":"","category":"section"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"We need a way to \"lift\" a \"Distribution\" (without parameters, so really a family) to a Model, or one with parameters to a ConditionalModel","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"Models are \"function-like\", so a ConditionalModel should be sometimes usable as a value. m1(m2(args)) should work.","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"This also means m1 ∘ m2 should be fine","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"Since inference primitives are specialized for the type of data, we can include methods for Union{Missing, T} data. PyMC3 has something like this, but for us it will be better since we know at compile time whether any data are missing.","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"There's a return available in case you want a result other than a NamedTuple, but it's a little fiddly still. I think whether the return is respected or ignored should depend on the inference primitive. And some will also modify it, similar to how a state monad works. Likelihood weighting is an example of this.","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"Rather than having lots of functions for inference, anything that's not a primitive should (I think for now at least) be a method of... let's call it sample. This should always return an iterator, so we can combine results after the fact using tools like IterTools, ResumableFunctions, and Transducers.","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"This situation just described is for generating a sequence of samples from a single distribution. But we may also have models with a sequence of distributions, either observed or sampled, or a mix. This can be something like Haskell's iterateM, though we need to think carefully about the specifics.","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"We already have a way to merge models, we should look into intersection as well.","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"We need ways to interact with Turing and Gen. Some ideas:","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"Turn a Soss model into an \"outside\" (Turing or Gen) model\nEmbed outside models as a black box in a Soss model, using their methods for inference","category":"page"},{"location":"to-do-list/","page":"To-Do List","title":"To-Do List","text":"We are working on the SossMLJ package, which will provide an interface between Soss and the MLJ machine learning framework.","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"CurrentModule = Soss","category":"page"},{"location":"installing-soss/#Getting-Started","page":"Installing Soss","title":"Getting Started","text":"","category":"section"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"Soss is an officially registered package, so to add it to your project you can type","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"julia> import Pkg; Pkg.add(\"Soss\")","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"within the julia REPL and you are ready for using Soss. If it fails to precompile, it could be due to one of the following:","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"You have gotten an old version due to compatibility restrictions with your current environment.","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"Should that happen, create a new folder for your Soss project, launch a julia session within, type","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"julia> import Pkg; Pkg.activate(pwd())","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"and start again. More information on julia projects here.","category":"page"},{"location":"installing-soss/","page":"Installing Soss","title":"Installing Soss","text":"You have set up PyCall to use a python distribution provided by yourself. If that is the case, make sure to install the missing python dependencies, as listed in the precompilation error. More information on PyCall's python version here.","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = Soss","category":"page"},{"location":"#Soss","page":"Home","title":"Soss","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Soss is a library for probabilistic programming.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The source code is available in the GitHub repository.","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"Soss needs the body of a model to be of the form","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"begin\n    line_1\n    ⋮\n    line_n\nend","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"Each line is syntactically translated into a Statement. This is an abstract type, with subtypes Assign and Sample. For example,","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"x ~ Normal(μ,σ)","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"becomes","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"Sample(:x, :(Normal(μ,σ)))","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"Next, all of the Samples are brought together to build a named tuple mapping each Symbol to its Expr. This becomes the dists field for a Model.","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"Because all of this is entirely syntactic, translating into another form only helps when its done on the right side of ~ or =. Otherwise we need another way to represent this information.","category":"page"},{"location":"sossmlj/","page":"SossMLJ.jl","title":"SossMLJ.jl","text":"CurrentModule = Soss","category":"page"},{"location":"sossmlj/#SossMLJ.jl","page":"SossMLJ.jl","title":"SossMLJ.jl","text":"","category":"section"},{"location":"sossmlj/","page":"SossMLJ.jl","title":"SossMLJ.jl","text":"The SossMLJ.jl package integrates Soss.jl into the MLJ.jl machine learning framework.","category":"page"},{"location":"sossmlj/","page":"SossMLJ.jl","title":"SossMLJ.jl","text":"More details are available in the SossMLJ.jl GitHub repository.","category":"page"}]
}
