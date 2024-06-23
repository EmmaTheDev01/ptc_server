import PaymentRequest from "../models/PaymentRequest.js"

export const createPaymentRequest = async (req,res) =>{
    const newPaymentRequest = new PaymentRequest(req.body) 
    try{
       const savedPaymentRequest = await newPaymentRequest.save();
       res.status(200).json({
        success:true,
        message: 'PaymentRequest successful',
        data: savedPaymentRequest, 
       })

    }catch(err){
        res.status(500).json({
            success:false,
            message:'PaymentRequest failed',
        })
    }
};

//Get single PaymentRequest details

export const getPaymentRequest = async(req, res) =>{
    const id = req.params.id
    try{
        const book = await PaymentRequest.findById(id)
        res.status(200).json({
            success:true,
            message:'PaymentRequest details',
            data: book,
        })
    }catch(err){
        res.status(404).json({
            success:false,
            message: 'No available PaymentRequest data found',
        })
    }
};

//Get all boooking details

export const getAllPaymentRequest = async(req, res) =>{
    
    try{
        const allPaymentRequest = await PaymentRequest.find()
        res.status(200).json({
            success:true,
            message:'PaymentRequest details',
            data: allPaymentRequest,
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message: 'No available PaymentRequest data found',
        })
    }
}