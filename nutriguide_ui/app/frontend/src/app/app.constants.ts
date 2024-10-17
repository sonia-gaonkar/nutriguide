export const AppConstants = {
    serverURL:"http://localhost:4200/api/v1/",
    serverAPI:"/api/v1/",
    watsonServerURL: "https://10.81.32.201:7060/aiapi/v1/",
    watsonServerBotURL: "",
    opensearchURL: "",
    
    apiKey: "",
    rfpModelID : 'MIXTRAL-8X7B-INSTRUCT-V01',
    rfpProjecId: "",
    
    analysisPrompt: "From the given context, find most accurate answers for the given question. Answers should be only from the provided context only. Do not add any explanation.\n context: {context} \nquestion:{question} \n Output format:\n Question:[Assessment Criteria] \n Answer:[Response from IBM Product Master] \n Area:[Area] \n File Name:[FileName] \n Give all the results in JSON format only. \n Separate each result with a comma. \n Output:",

    chatPrompt: "Analyze following pieces of context and identify related questions from given context only. For that questions extract the food name and find correct data from context.If you do not find answer, say don't no.\ncontext: {context}\nquestion:{question}\nOutput should be only in JSON format.\n\nFollow the below output format:\nFood Name:\nDetails of food:",
    
    decodingMethod: "greedy",
    embeddingModel: "all-MiniLM-L6-v2",
    temperature: 0,
    rfpurl: "https://us-south.ml.cloud.ibm.com",
    maxTokens: 1000,
    minTokens: 100,



    FeaturesData: [
            {
                "feature": "Nutritional Breakdown",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Food Groups Overview",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Calorie Count",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Meal Planning",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Mindful Eating Strategies",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Nutritional Myths & Facts",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Physical Activity Guidance",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Dietary Considerations",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Hydration Tips",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Seasonal Food",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "Cooking Substitutes",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            },
            {
                "feature": "FAQs",
                "data": "Food provides energy and nutrients that are essential for your health. These include proteins, carbohydrates, and fats (called macronutrients), and vitamins and minerals (called micronutrients). Having a balanced diet helps ensure you get all the nutrients your body needs."
            }
    ]
	
                
}
