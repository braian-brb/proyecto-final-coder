export const routeExists = (req, res, next) => {
  res
    .status(404)
    .json({ error: -2, descripcion: `${req.originalUrl} no encontrado` });
};

export const isAdmin = (req, res, next) => {
  const admin = true;
  console.log(admin);
  if (admin) {
    console.log("You are admin");
    next();
  } else {
    res.json({
      error: -1,
      descripcion: `route ${req.originalUrl} , 
                    método 'y' no autorizada`,
    });
  }
};
