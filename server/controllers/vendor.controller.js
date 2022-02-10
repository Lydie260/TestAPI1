import Client from '../models/db/usermodel';
import jwtDecode from 'jwt-decode';

class vendor {
    static async getAllclients (req, res){
      const clients = await Client.find({});
      res.status(200).json({
          status: 200,
          data: clients
      })
    }
}
export default vendor;