import { DATE } from "sequelize";
import Link from "../../database/model/Link";
import jwt from "jsonwebtoken";
import config from "../../config";

function generateRandomSlug(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    slug += charset[randomIndex];
  }

  return slug;
}

async function create(req, res) {
  const { link } = req.body;
  const userId = req.user.id;
  const randomSlug = generateRandomSlug(10);
  Link.create({ slug: randomSlug, link, owner: userId })
    .then(function (data) {
      res.status(200).json({ message: "link created", data });
    })
    .catch(function (error) {
      res.status(500).json({ message: "error!", error });
    });
}

async function update(req, res) {
  const { link } = req.body;
  const slug = req.params.slug;
  const userId = req.user.id;

  const existingLink = await Link.findOne({
    where: { slug: slug, owner: userId },
  });

  if (!existingLink) {
    return res.status(404).json({
      message: "Link not found or you don't have permission to update it",
    });
  }

  try {
    const [affectedRowsCount, affectedRows] = await Link.update(
      { link },
      { where: { slug: slug, owner: userId }, returning: true }
    );

    if (affectedRowsCount === 0) {
      return res.status(500).json({ message: "Failed to update link" });
    }

    res
      .status(200)
      .json({ message: "Link updated!", data: affectedRows[0].dataValues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in updating link!", data: error });
  }
}

async function listAllByUserId(req, res) {
  const userId = req.user.id;
  Link.findAndCountAll({
    attributes: ["slug", "link", "visit_counts"],
    order: [["created_at", "DESC"]],
    where: {
      owner: userId,
    },
  })
    .then(function ({ rows }) {
      res.status(200).json({ message: "links are found!", data: rows });
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "error in retrieving links", data: error });
    });
}

async function redirect(req, res) {
  const slug = req.params.slug;
  Link.findOne({
    where: {
      slug,
    },
  })
    .then(function (data) {
      if (data?.dataValues) {
        Link.update(
          { visit_counts: data.dataValues.visit_counts + 1 },
          {
            where: {
              slug,
            },
          }
        )
          .then(function () {
            res.redirect(data.dataValues.link);
            return;
          })
          .catch(function (errorUpdate) {
            res
              .status(500)
              .json({ message: "an error occured", data: errorUpdate });
          });
      } else {
        res.status(400).json({ message: "not found" });
        return;
      }
    })
    .catch(function (error) {
      res
        .status(500)
        .json({ message: "error in retrieving links", data: error });
    });
}

async function deleteLink(req, res) {
  console.log(req.params.slug);
  const slug = req.params.slug;
  const userId = req.user.id;
  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    const link = await Link.findOne({
      where: { slug: slug, owner: userId },
    });

    if (!link) {
      return res.status(404).json({
        error: "Link not found or you don't have permission to delete it",
      });
    }

    await link.destroy();

    res.status(200).json({ message: "Link successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete link" });
  }
}

const linkController = {
  create,
  update,
  listAllByUserId,
  redirect,
  deleteLink,
};

export default linkController;
