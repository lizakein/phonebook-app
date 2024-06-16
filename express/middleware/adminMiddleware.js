const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin')
    res.status(403).send({ message: 'Доступ запрещен' });
  next();    
};

module.exports = {
  checkAdminRole
};
