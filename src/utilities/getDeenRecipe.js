
  function getDeenRecipe() {
    setLoading(true);

    // Submit prompt to openAI API
    const prompt = `Rewrite this recipe in the style of Paula Deen: ${JSON.stringify(recipe)} Format response as: {"dish": ${dishName}, "ingredients": [array of strings],
    "instructions": [array of strings]} Do not return anything in addition to this data object.`;

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        console.log(generatedText);
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setUserInput("")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
        setRecipe("");
      });
  }
