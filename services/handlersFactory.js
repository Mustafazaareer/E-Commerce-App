const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')
const ApiFeatures =require('../utils/apiFeatures')

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    document.deleteOne();
    res.status(204).send();
  });

exports.updateOne = (Model)=>asyncHandler( async(req,res,next)=>{
    // const id =req.params.id;
    const document =await Model.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!document){
        return next(new ApiError(`No ${Model} for this id : ${req.params.id}`,404))
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json({data:document})
})

exports.createOne =(Model)=>asyncHandler(async(req,res)=>{
    const document = await Model.create(req.body);
    res.status(201).json({data:document})
});

exports.getOne =(Model,populationOpt)=>
    asyncHandler( async(req,res,next)=>{
        // const id =req.params.id;
        const {id}= req.params;
        //1) Build query
        const query = Model.findById(id)
        if(populationOpt){
            query.populate(populationOpt)
        }
        //2) Execute query
        const document=await query;

        if(!document){
            return next(new ApiError(`No document for this id : ${id}`,404))
        }
        res.status(200).json({data:document})
    
})

exports.getAll =(Model)=>asyncHandler( async(req,res)=>{
    let filter={};
    if(req.filterObj){
        filter=req.filterObj;
        console.log(filter)
    }
    //  Build query : 
    const documentCounts=await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter),req.query)
        .paginate(documentCounts)
        .filter()
        .search()
        .limitFields()
        .sort();
    //Execute query
    const {mongooseQuery,paginationResult}=apiFeatures;
    const documents = await mongooseQuery;
res.status(200).json({reauslts:documents.length,paginationResult,data:documents})
})