const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const eventBridge = new AWS.EventBridge();

exports.handler = async (event) => {
  const { userId, amount } = JSON.parse(event.body);

  const updateRetirementAccount = {
    TableName: 'RetirementAccountTable',
    Key: { userId: userId },
    UpdateExpression: 'SET balance = balance - :amount',
    ExpressionAttributeValues: {
      ':amount': amount
    }
  };

  const updateBankAccount = {
    TableName: 'BankAccountTable',
    Key: { userId: userId },
    UpdateExpression: 'SET balance = balance + :amount',
    ExpressionAttributeValues: {
      ':amount': amount
    }
  };

  try {
    await Promise.all([
      dynamoDb.update(updateRetirementAccount).promise(),
      dynamoDb.update(updateBankAccount).promise()
    ]);

    const eventParams = {
      Entries: [
        {
          Source: 'app.withdrawal',
          DetailType: 'WithdrawalProcessed',
          Detail: JSON.stringify({ userId, amount }),
          EventBusName: 'default'
        }
      ]
    };

    await eventBridge.putEvents(eventParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Withdrawal successful' })
    };
  } catch (error) {
    console.error('Error handling withdrawal', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error handling withdrawal' })
    };
  }
};
