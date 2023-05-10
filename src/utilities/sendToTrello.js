export default function sendToTrello(items) {
  const apiKey = import.meta.env.VITE_trello_apiKey;
  const apiToken = import.meta.env.VITE_trello_apiToken;
  const listId = import.meta.env.VITE_trello_listId;
    
  const createTrelloCard = async (item) => {
    const url = `https://api.trello.com/1/cards?key=${apiKey}&token=${apiToken}&idList=${listId}&name=${encodeURIComponent(item)}`;

    const response = await fetch(url, {
      method: 'POST',
    });

    if (response.ok) {
      console.log(`Created card for "${item}"`);
    } else {
      console.error(`Failed to create card for "${item}"`);
    }
  };

  const createCardsOnTrelloBoard = async () => {
    for (const item of items) {
      await createTrelloCard(item);
    }
  };

  createCardsOnTrelloBoard();
}