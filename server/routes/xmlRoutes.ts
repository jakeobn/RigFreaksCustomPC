import express from 'express';
import { processXMLRequest } from '../services/xmlService';

const router = express.Router();

// XML API endpoint
router.post('/api/xml', async (req, res) => {
  try {
    // Get the raw XML request body
    const xmlString = req.body;
    
    // If the request is not in XML format, return an error
    if (typeof xmlString !== 'string' || !xmlString.includes('<?xml')) {
      return res.status(400).send(
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<tcresponse>\n' +
        '  <response>\n' +
        '    <result>ERROR</result>\n' +
        '    <responsedatetime>' + new Date().toISOString() + '</responsedatetime>\n' +
        '    <message>Invalid XML request format</message>\n' +
        '  </response>\n' +
        '</tcresponse>'
      );
    }
    
    // Process the XML request
    const xmlResponse = await processXMLRequest(xmlString);
    
    // Send the XML response
    res.set('Content-Type', 'application/xml');
    res.send(xmlResponse);
  } catch (error) {
    console.error('Error processing XML request:', error);
    
    // Return a properly formatted XML error response
    res.status(500).send(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<tcresponse>\n' +
      '  <response>\n' +
      '    <result>ERROR</result>\n' +
      '    <responsedatetime>' + new Date().toISOString() + '</responsedatetime>\n' +
      '    <message>Internal server error</message>\n' +
      '  </response>\n' +
      '</tcresponse>'
    );
  }
});

export default router;