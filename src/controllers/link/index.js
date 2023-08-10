import { DATE } from "sequelize";
import Link from "../../database/model/Link";

async function create(req, res) {
  const { slug, link } = req.body;
  const userId = req.session.auth;
  Link.create({ slug, link, owner: userId })
    .then(function (data) {
      res.status(200).json({ message: "link created", data });
    })
    .catch(function (error) {
      res.status(500).json({ message: "error!", error });
    });
}

async function update(req, res) {
  const { slug, link } = req.body;
  const userId = req.session.auth;
  Link.update(
    { link },
    {
      where: { slug, owner: userId },
    }
  )
    .then(function (data) {
      res.status(200).json({ message: "link updated!", data: data.dataValues });
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({ message: "error in updating link!", data: error });
    });
}

async function listAllByUserId(req, res) {
  const userId = req.session.auth;
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
  const { slug } = req.body;
  const userId = req.session.auth;
  try {
    await Link.destroy({
      where: { slug, owner: userId },
    });
    res.status(200).json({ link: "successfully deleted!" });
  } catch (error) {
    res.status(500).json({ link: "failed to delete" });
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
