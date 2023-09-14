import {Response} from 'express'
const SuccessHandler = <T>(data:T, statusCode:number, res: Response) => {
  return res.status(statusCode).json({
    success: true,
    data: data,
  });
};

  export default SuccessHandler