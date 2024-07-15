const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const accountParams = {
    TableName: 'RetirementAccount',
    Key: { userId: event.userId }
  };

  const bankParams = {
    TableName: 'BankAccount',
    Key: { userId: event.userId }
  };

  try {
    const [returementAccountData, bankAccountData] = await Promise.all([
      dynamoDb.get(accountParams).promise(),
      dynamoDb.get(bankParams).promise()
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        retirementAccountBalance: returementAccountData.Item.balance,
        bankAccountBalance: bankAccountData.Item.balance
      })
    };
  } catch (error) {
    console.error('Error fetching balances', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching balances' })
    };
  }
};
