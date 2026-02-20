import Contact from "../models/Contact.js";

export const sendMessage = async (req, res) => {
  const msg = await Contact.create(req.body);
  res.json(msg);
};

export const getMessages = async (req, res) => {
  res.json(await Contact.find().sort({ createdAt: -1 }));
};
