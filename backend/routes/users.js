import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router()

/* Add a new user */
router.post("/adduser", async (req, res) => {
    try {
        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user instance with the hashed password
        const newUser = new User({
            userFullName: req.body.userFullName,
            email: req.body.email,
            password: hashedPassword,
            mobileNumber: req.body.mobileNumber,
            userType: req.body.userType,
            age: req.body.age,
            gender: req.body.gender,
            dob: req.body.dob,
            address: req.body.address,
            points: req.body.points,
            isAdmin: req.body.isAdmin,
            activeTransactions: req.body.activeTransactions,
            prevTransactions: req.body.prevTransactions,
        });

        // Save the user to the database
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

/* Getting user by id */
router.get("/getuser/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("activeTransactions").populate("prevTransactions")
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } 
    catch (err) {
        return res.status(500).json(err);
    }
})

/* Getting all members in the library */
router.get("/allmembers", async (req,res)=>{
    try{
        const users = await User.find({}).populate("activeTransactions").populate("prevTransactions").sort({_id:-1})
        res.status(200).json(users)
    }
    catch(err){
        return res.status(500).json(err);
    }
})

/* Update user by id */
router.put("/updateuser/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        return res.status(403).json("You can update only your account!");
    }
})

/* Adding transaction to active transactions list */
router.put("/:id/move-to-activetransactions" , async (req,res)=>{
    if(req.body.isAdmin){
        try{
            const user = await User.findById(req.body.userId);
            await user.updateOne({$push:{activeTransactions:req.params.id}})
            res.status(200).json("Added to Active Transaction")
        }
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("Only Admin can add a transaction")
    }
})

/* Adding transaction to previous transactions list and removing from active transactions list */
router.put("/:id/move-to-prevtransactions", async (req,res)=>{
    if(req.body.isAdmin){
        try{
            const user = await User.findById(req.body.userId);
            await user.updateOne({$pull:{activeTransactions:req.params.id}})
            await user.updateOne({$push:{prevTransactions:req.params.id}})
            res.status(200).json("Added to Prev transaction Transaction")
        }
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("Only Admin can do this")
    }
})

/* Delete user by id */
router.delete("/deleteuser/:id", async (req, res) => {
    try {
        // Delete the user by id
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
    } catch (err) {
        return res.status(500).json(err);
    }
})

// Search users by name or phone number
router.get('/searchusers', async (req, res) => {
    const query = req.query.query;
    try {
        const users = await User.find({
            $or: [
                { mobileNumber: query }
            ]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router