


const authorizedHost = (req, res, next)=>{

    // if not of 'host'
    if (req.user.role !== 'host') {
        return res.status(400).send(`Role: ${req.user.role} is not allowed to access resource`)
    }

    next()
}

const authorizedCook = (req, res, next)=>{

  // if not of 'cooker'
  if (req.user.role !== 'cooker') {
      return res.status(400).send(`Role: ${req.user.role} is not allowed to access resource`)
  }

  next()
}

module.exports = {authorizedCook, authorizedHost}