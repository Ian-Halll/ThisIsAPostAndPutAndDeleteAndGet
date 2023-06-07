const router = require('express').Router();

const {
  updateUser,
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  addFriend,
removeFriend
} = require('../../controllers/userController.js');

router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
