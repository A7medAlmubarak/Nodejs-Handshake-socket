const path = require('path');
const subjectService = require('../services/subjectService');

class homeController {
    static async getHomePage(req, res) {
      const { subjectId, mark} = req.body;

      try {
        const user = await subjectService.submitMark(subjectId, mark);
        res.status(200).send('You have been registered :'+user);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
  
      
      }
}
module.exports = homeController;