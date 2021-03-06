import {Request, Response, NextFunction} from "express";
import Requirement from "../db/models/RequirementModel";
import {RequirementType} from "../db/models/RequirementModel";
import boom from "boom";
import User from "../db/models/UserModel";
import env from "../env";

const getAllRequirement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requirements = await Requirement.find({status: "active"})
      .populate("type")
      .populate("school")
      .populate("requiredBy");
    return res.json({status: true, msg: "", data: JSON.stringify(requirements)});
  } catch (err) {
    console.log("Error in getAllRequirement[Requirement Controller]", err);
    return res.json({status: false, msg: "Error in loading requirements"});
  }
};

const getRequirementBySchoolId = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return next(boom.badRequest("Invalid request"));
  const {schoolId} = req.body;
  try {
    const requirements = await Requirement.find({school: schoolId});
    return res.json({status: true, msg: "", data: requirements});
  } catch (err) {
    console.log("Error in getRequirementBySchoolId[Requirement Controller]", err);
    return res.json({status: false, msg: "Error in loading requirements"});
  }
};

const addRequirementTypes = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return next(boom.badRequest("Please enter requirement types"));
  if (req.session.data.user.role != "admin")
    return next(boom.unauthorized("You are not authorized to add requirement types"));
  const {reqTypes} = req.body;
  try {
    let reqTypesObj = [];
    if (typeof reqTypes == "object") {
      for (let i = 0; i < reqTypes.length; i++) {
        let newReqType = await RequirementType.findOneAndUpdate(
          {title: reqTypes[i]},
          {title: reqTypes[i]},
          {new: true, upsert: true}
        );
        reqTypesObj[i] = newReqType;
      }
    } else {
      let newReqType = await RequirementType.findOneAndUpdate(
        {title: reqTypes},
        {title: reqTypes},
        {new: true, upsert: true}
      );
      reqTypesObj[0] = newReqType;
    }
    return res.json({status: true, msg: "Types added succesfully", data: reqTypesObj});
  } catch (err) {
    console.log("Error in addRequirementTypes[Requirement Controller]", err);
    return res.json({status: false, msg: "Error in adding requirement types"});
  }
};

const addRequirement = async (req: Request, res: Response, next: NextFunction) => {
  console.log("here000");
  if (!req.body) return next(boom.badRequest("Please enter all required fields"));
  const {type, category, description, quantity} = req.body;
  const files = req.files;
  const requiredBy = req.session.user_id;
  console.log("here001");
  if (!files) return next(boom.badRequest("Please upload atleast 1 Image"));
  console.log("here002");
  if (!type) return next(boom.badRequest("Please select requirement type"));
  console.log("here003");
  if (!quantity) return next(boom.badRequest("Please enter quantity of the requirement"));
  console.log("here004");
  if (!description) return next(boom.badRequest("Please enter description of the requirement"));
  try {
    console.log("here");
    const userRole = req.session.data.user.role;
    if (userRole != "schoolAdmin")
      return next(boom.unauthorized("You are not authorized to add requirements"));
    const schoolId = req.session.data.user.school;
    if (!schoolId) return next(boom.unauthorized("You are not linked with any school"));
    let imgObjects = [];
    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
      // let imgUrl = await uploadImage({file_path: files[i].path});
      let imgUrl = `${env.SERVER_URI}/public/uploads/${files[i].filename}`;
      let imgObject = {
        url: imgUrl,
        tag: files[i].originalname,
      };
      imgObjects[i] = imgObject;
    }
    const newRequirement = new Requirement({
      type,
      category,
      description,
      imgs: imgObjects,
      requiredBy,
      quantity,
      school: schoolId,
    });
    const newRequirementDoc: any = await newRequirement.save();
    return res.json({status: true, msg: "Requirement added succesfully", data: newRequirementDoc});
  } catch (err) {
    console.log("==============> Error in addRequirement [RequirementsController.ts]", err);
    return next(boom.badImplementation("Error in adding requirement"));
  }
};

const delRequirement = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return next(boom.badRequest("Please select the requirement you want to delete"));
  const {reqId} = req.body;
  if (!reqId)
    return next(
      boom.badRequest("Please select the requirement you want to delete[reqId not found]")
    );
  try {
    const query = Requirement.findOneAndRemove({_id: reqId});
    const remReqModel = await query.exec();
    return res.json({status: true, msg: "Requirement removed Succesfully", data: remReqModel});
  } catch (err) {
    return res.json({status: false, msg: "Error in deleting requirement"});
  }
};

const commitRequirement = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return next(boom.badRequest("Invalid Request"));
  const {reqId} = req.body;
  const {user_id} = req.session;
  if (!reqId)
    return next(
      boom.badRequest("Please select the requirement you want to commit[reqId not found]")
    );
  try {
    const requirement = await Requirement.findOneAndUpdate(
      {_id: reqId},
      {_id: reqId, $addToSet: {commitedBy: user_id}},
      {new: true}
    );
    const user = await User.findOneAndUpdate(
      {_id: user_id},
      {_id: user_id, $addToSet: {commitedReqs: reqId}},
      {new: true}
    );
    return res.json({status: true, msg: "Requirement Commited", data: requirement});
  } catch (err) {
    console.log(err);
    return res.json({status: false, msg: "Error in commitRequirement"});
  }
};

const closeRequirement = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return next(boom.badRequest("Invalid Request"));
  const {reqId} = req.body;
  if (!reqId) return next(boom.badRequest("Please select the requirement you want to update"));
  try {
    const requirement = await Requirement.findOneAndUpdate(
      {_id: reqId},
      {_id: reqId, $set: {status: "closed"}},
      {new: true}
    );
    return res.json({status: true, msg: "Requirement closed", data: requirement});
  } catch (err) {
    return res.json({status: false, msg: "Error in closing Requirement"});
  }
};

const updateRequirementQuantity = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return next(boom.badRequest("Invalid Request"));
  const {reqId, newQuantity} = req.body;
  if (!reqId) return next(boom.badRequest("Please select the requirement you want to update"));
  if (!newQuantity) return next(boom.badRequest("Please enter new quantity of the requirement"));
  try {
    const requirement = await Requirement.findOneAndUpdate(
      {_id: reqId},
      {_id: reqId, $set: {quantity: newQuantity}},
      {new: true}
    );
    return res.json({status: true, msg: "Requirement quantity updated", data: requirement});
  } catch (err) {
    return res.json({status: false, msg: "Error in updating Requirement"});
  }
};

const requirementController = {
  addRequirement: addRequirement,
  delRequirement: delRequirement,
  closeRequirement: closeRequirement,
  updateRequirementQuantity: updateRequirementQuantity,
  getAllRequirements: getAllRequirement,
  getRequirementBySchoolId: getRequirementBySchoolId,
  addRequirementTypes: addRequirementTypes,
  commitRequirement: commitRequirement,
};

export default requirementController;
