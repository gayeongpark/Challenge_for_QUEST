import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chat({ category }) {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) {
      return; // do not send empty message
    }
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: 'user', message: inputValue },
    ]);
    sendMessage(inputValue);
    setInputValue('');
  };
  const sendMessage = async (message) => {
    try {
      setisLoading(true);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
          },
        }
      );
      console.log(response);
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        //Copy the previous conversation
        { type: 'bot', message: response.data.choices[0].message.content },
        //This is the answer from ChatGPT
      ]);
      setisLoading(false);
    } catch (error) {
      setisLoading(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (category && chatLog.length === 0) {
      // add a check to skip sending the initial empty message
      sendMessage(category);
    }
  }, [category]);

  return (
    <div className='flex flex-col min-h-screen gap-2 justify-center items-center'>
      <h1 className='text-white'>Funny Bot</h1>

      {chatLog.map((message, index) => (
        <div className='text-white text-lg' key={index}>
          {message.message}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='What kind of joke you do want?'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className='px-3.5 py-2.5 text-lg rounded-md'
        />
        <button
          className='rounded-md bg-red-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
          type='submit'
        >
          Send
        </button>
      </form>
    </div>
  );
}
