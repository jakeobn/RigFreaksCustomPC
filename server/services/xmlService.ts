import * as xml2js from 'xml2js';
import { db } from '../db';
import { pcComponents } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Define interfaces for XML request/response handling
interface XMLRequest {
  account?: string;
  securitycode?: string;
  action?: string;
  prodcode?: string | string[];
  stockcode?: string | string[];
  category?: string;
  areacode?: string;
  brand?: string;
  searchterm?: string;
  ordnum?: string;
  orderref?: string;
  // Order properties for basket creation
  orderlines?: {
    stockcode: string;
    quantity: number;
  }[];
  deliveryservice?: string;
  deliverycontact?: string;
  deliverycompany?: string;
  addressline1?: string;
  addressline2?: string;
  addressline3?: string;
  addresstown?: string;
  country?: string;
  postcode?: string;
  deliveryphone?: string;
  deliveryemail?: string;
}

interface XMLResponse {
  response: {
    result: string;
    responsedatetime: string;
    message?: string;
    product?: any[];
    totalprods?: number;
    category?: any[];
    areacode?: any[];
    brandcode?: any[];
    header?: any;
    line?: any[];
  };
}

// Format XML response object to XML string
const formatXMLResponse = (responseObj: XMLResponse): string => {
  const builder = new xml2js.Builder({ 
    rootName: 'tcresponse',
    headless: true,
    renderOpts: { 
      pretty: true,
      indent: '  ',
      newline: '\n' 
    }
  });
  
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.buildObject(responseObj);
};

// Create a basic response object
const createResponseObject = (result: string = 'OK'): XMLResponse => {
  return {
    response: {
      result: result,
      responsedatetime: new Date().toISOString()
    }
  };
};

// Handle stock check for a single product
export const handleStockCheck = async (request: XMLRequest): Promise<string> => {
  const response = createResponseObject();
  
  // Get the product code to check
  const productCode = Array.isArray(request.prodcode) 
    ? request.prodcode[0] 
    : request.prodcode || '';
    
  try {
    // Query the database for the product
    const product = await db.select()
      .from(pcComponents)
      .where(eq(pcComponents.id, parseInt(productCode, 10)))
      .limit(1);
    
    if (product && product.length > 0) {
      // Product found, add to response
      response.response.product = [{
        prodcode: product[0].id.toString(),
        description: product[0].name,
        price: product[0].price.toString(),
        brand: product[0].brand || '',
        category: product[0].type, // Use type field as category
        instock: product[0].inStock ? 'true' : 'false',
        stocklevel: product[0].inStock ? '10' : '0' // Arbitrary stock level for now
      }];
    } else {
      // Product not found
      response.response.result = 'NOTFOUND';
    }
  } catch (error) {
    console.error('Error in stock check:', error);
    response.response.result = 'ERROR';
    response.response.message = 'Database error occurred';
  }
  
  return formatXMLResponse(response);
};

// Handle stock check for all products or by category
export const handleStockCheckAll = async (request: XMLRequest): Promise<string> => {
  const response = createResponseObject();
  
  try {
    let query = db.select().from(pcComponents);
    
    // Filter by category if specified (category = type in our schema)
    if (request.category) {
      query = query.where(eq(pcComponents.type, request.category));
    }
    
    // Execute the query
    const products = await query;
    
    if (products && products.length > 0) {
      // Format products for XML response
      response.response.product = products.map((product) => ({
        prodcode: product.id.toString(),
        description: product.name,
        price: product.price.toString(),
        brand: product.brand || '',
        category: product.type, // Use type field as category
        instock: product.inStock ? 'true' : 'false',
        stocklevel: product.inStock ? '10' : '0' // Arbitrary stock level for now
      }));
      
      response.response.totalprods = products.length;
    } else {
      // No products found
      response.response.result = 'NOPRODUCTS';
      response.response.totalprods = 0;
    }
  } catch (error) {
    console.error('Error in stock check all:', error);
    response.response.result = 'ERROR';
    if (response.response.product === undefined) {
      response.response.product = [];
    }
    response.response.totalprods = 0;
  }
  
  return formatXMLResponse(response);
};

// Process XML request
export const processXMLRequest = async (xmlString: string): Promise<string> => {
  try {
    // Parse the XML request
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlString);
    
    // Extract the request data
    const requestData: XMLRequest = result.tcrequest;
    
    // Check for required fields
    if (!requestData.account || !requestData.securitycode || !requestData.action) {
      const response = createResponseObject('ERROR');
      response.response.message = 'Missing required fields: account, securitycode, or action';
      return formatXMLResponse(response);
    }
    
    // Authenticate the request (simple check for demo purposes)
    if (requestData.account !== 'RIGFREAKS001' || requestData.securitycode !== 'XYZ123456') {
      const response = createResponseObject('AUTHFAIL');
      response.response.message = 'Authentication failed';
      return formatXMLResponse(response);
    }
    
    // Process different action types
    switch (requestData.action) {
      case 'STOCKCHECK':
        return await handleStockCheck(requestData);
        
      case 'STOCKCHECKALL':
        return await handleStockCheckAll(requestData);
        
      default:
        const response = createResponseObject('ERROR');
        response.response.message = 'Unsupported action: ' + requestData.action;
        return formatXMLResponse(response);
    }
  } catch (error) {
    console.error('Error processing XML request:', error);
    
    const response = createResponseObject('ERROR');
    response.response.message = 'Error processing XML request';
    return formatXMLResponse(response);
  }
};