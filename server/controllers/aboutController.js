import About from "../models/About.js";

export const updateAbout = async (req, res) => {
  const about = await About.findOneAndUpdate(
    {},
    { content: req.body.content },
    { upsert: true, new: true }
  );
  res.json(about);
};

export const getAbout = async (req, res) => {
  res.json(await About.findOne());
};
