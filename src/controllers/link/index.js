import Link from "../../database/model/Link";

function create(req, res) {
  const { slug, link } = req.body;
  Link.create({ slug, link, owner: 1 })
    .then(function (data) {
      res.status(200).json({ message: "link created", data });
    })
    .catch(function (error) {
      res.status(500).json({ message: "error!", error });
    });
}

function update(req, res) {
  const { id, slug, link } = req.body;
  Link.update(
    { link },
    {
      where: { id },
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

function listAllByUserId(req, res) {
  const userId = req.params.userId;
  Link.findAndCountAll({
    attributes: ["slug", "link", "visit_counts"],
    order: [["created_at", "DESC"]],
    where: {
      owner: userId,
    },
  })
    .then(function ({ count, rows }) {
      res
        .status(200)
        .json({ message: `${count} links are found!`, data: rows });
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "error in retrieving links", data: error });
    });
}

function redirect(req, res) {
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

const linkController = { create, update, listAllByUserId, redirect };

export default linkController;
