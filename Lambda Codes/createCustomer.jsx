import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const { firstName, lastName, email, phone, address } = JSON.parse(event.body);
    const customerId = Date.now().toString();

    // Basic validation
    if (!firstName || !lastName || !email) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ error: 'First name, last name, and email are required' })
        };
    }

    const params = {
        TableName: 'CustomerRecords',
        Item: { customerId, firstName, lastName, email, phone, address }
    };

    try {
        await docClient.send(new PutCommand(params));
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ customerId, firstName, lastName, email, phone, address })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
