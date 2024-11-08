import React, { useState, useEffect, useRef } from 'react';
import './chatPrueba.css';
import Navbar from '../Home/Navbar';
import { Box, Button, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import ChatBox from './chatBox';
import AssistantBox from './assistantBox';
import ConfirmationDialog from './confirmationDialog';
import { getAssistants, getUserInfo, updateAssistant } from '../services/bffService';
import Loading from '../components/Loading';

function ChatPrueba() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState({}); // Guarda conversaciones por asistente
  const [input, setInput] = useState('');
  const [extraPrompt, setExtraPrompt] = useState('');
  const [dates, setDates] = useState("");
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAssistant, setPendingAssistant] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [demoChannelId, setDemoChannelId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const messagesEndRef = useRef(null);
  const [etag, setEtag] = useState(null); 

  const generateConversationId = () => {
    return String(Date.now()) + Math.floor(Math.random() * 999999);
  };

  useEffect(() => {
    setSource(generateConversationId()); 
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startNewConversation = () => {
    // Reinicia solo la conversación del asistente actual
    setConversations((prevConversations) => ({
      ...prevConversations,
      [selectedAssistant.id]: [], // Borra la conversación del asistente actual
    }));
    setMessages([]);
    setSource(generateConversationId());
    setIsTyping(false);
  };

  useEffect(() => {
    const fetchAssistantData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const assistantsData = await getAssistants(token);
        setAssistants(assistantsData);
        setSelectedAssistant(assistantsData[0]);
        setAssistantName(assistantsData[0].name);
        setExtraPrompt(assistantsData[0].config.extraPrompt || '');
        setAssistantInput(assistantsData[0].config.extraPrompt || '');

        const clientInfo = await getUserInfo(token);
        console.log(clientInfo, "CLIENTioNFO")
        setDemoChannelId(clientInfo?.clientInfo.details?.demoChannelId);
        setClientId(clientInfo.client_id);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchAssistantData();
  }, []);

  const handlePromptChange = (e) => {
    setAssistantInput(e.target.value);
    setIsModified(true);
  };

  const handleAssistantChange = (newAssistant) => {
    if (isModified || messages.length > 0) {
      setPendingAssistant(newAssistant);
      setShowConfirmation(true);
    } else {
      setConversations((prevConversations) => ({
        ...prevConversations,
        [selectedAssistant.id]: messages, // Guarda la conversación actual antes de cambiar
      }));
      const newMessages = conversations[newAssistant.id] || [];
      setMessages(newMessages);
      setSelectedAssistant(newAssistant);
      setAssistantName(newAssistant.name);
      setExtraPrompt(newAssistant.config.extraPrompt || '');
      setAssistantInput(newAssistant.config.extraPrompt || '');
      setSource(generateConversationId()); 
      setIsTyping(false);
    }
  };

  const confirmAssistantChange = () => {
    if (pendingAssistant) {
      setConversations((prevConversations) => ({
        ...prevConversations,
        [selectedAssistant.id]: messages,
      }));
      const newMessages = conversations[pendingAssistant.id] || [];
      setMessages(newMessages);
      setSelectedAssistant(pendingAssistant);
      setAssistantName(pendingAssistant.name);
      setExtraPrompt(pendingAssistant.config.extraPrompt || '');
      setAssistantInput(pendingAssistant.config.extraPrompt || '');
      setSource(generateConversationId()); 
      setIsTyping(false);

      setShowConfirmation(false);
      setPendingAssistant(null);
      setIsModified(false);
    }
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const eventId = String(Date.now()) + Math.floor(Math.random() * 999999);

      const newMessage = {
        id: eventId,
        clientId: clientId,
        channelId: demoChannelId,
        source: source,
        target: selectedAssistant.name, // Usa el nombre del asistente actual
        text: input,
      };

      setMessages((prevMessages) => [...prevMessages, { user: 'CLIENTE', text: input, timestamp: new Date() }]);

      try {
        await fetch('https://7slvz4c3sadkqahhvs2v6mvvua0arqfj.lambda-url.us-east-1.on.aws/6/asdasd123', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage),
        });

        setInput('');

        setIsTyping(true);
          
        setTimeout(() => startPolling(eventId), 10000);
      } catch (error) {
        console.error('Error enviando el mensaje:', error);
      }
    }
  };

  const startPolling = async (eventId) => {
    const pollingUrl = `https://ye7vfne74zvjc3twxc2h2mtkqq0ezayn.lambda-url.us-east-1.on.aws/${eventId}`;
  
    try {
      const response = await fetch(pollingUrl);
      const result = await response.json();
  
      if (result.action === 'SKIP') {
        console.log('Mensaje combinado con otro, no se muestra.');
        setIsTyping(false);
      } else if (result.action === 'WAIT') {
        setTimeout(() => startPolling(eventId), 1000);
      } else if (result.action === 'REPLY') {
        const replyMessages = result?.text
          ? [{ type: 'textWap', body: result.text }]
          : result.messages || [];
  
        replyMessages.forEach((replyMessage) => {
          let formattedMessage;
  
          if (replyMessage.type === 'textWap') {
            formattedMessage = replyMessage.body;
          } else if (replyMessage.type === 'text') {
            formattedMessage = `<p>${replyMessage.text.body}</p>`;
          } else if (replyMessage.type === 'image') {
            formattedMessage = `
              <div>
                <img src="${replyMessage.image.link}" alt="${replyMessage.image.caption || 'Imagen'}">
                ${replyMessage.image.caption ? `<p style="font-weight: bold;">${replyMessage.image.caption}</p>` : ''}
              </div>`;
          } else if (replyMessage.type === 'document') {
            formattedMessage = `<a href="${replyMessage.document.url}" target="_blank">${replyMessage.document.caption || 'Documento'}</a>`;
          }
  
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: selectedAssistant.name, text: formattedMessage, timestamp: new Date() }, // Muestra el nombre del asistente actual
          ]);
        });
  
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error durante el polling:', error);
      setIsTyping(false);
    }
  };

  const sendPromptToAssistant = async () => {
    setLoading(true);
    if (assistantInput.trim() !== '') {
      const token = localStorage.getItem('authToken');

      try {
        const assistants = await getAssistants(token);
        const firstAssistant = assistants[0]; 
        setDates(firstAssistant.last_updated);

        const updatedAssistant = {
          ...firstAssistant, 
          config: {
            ...firstAssistant.config, 
            extraPrompt: assistantInput, 
          },
        };

        await updateAssistant(firstAssistant.id, updatedAssistant, token);
        setExtraPrompt(assistantInput);

      } catch (error) {
        console.error('Error actualizando el asistente:', error);
      }
      setLoading(false);
    }
  };
  
  

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <Navbar />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loading />
        </Box>
      ) : (
        <div className="playground-container">
          <Header
            assistants={assistants}
            selectedAssistant={selectedAssistant}
            onAssistantChange={handleAssistantChange}
            isMobile={isMobile}
            navigate={navigate}
            startNewConversation={startNewConversation}
          />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <AssistantBox
              assistantInput={assistantInput}
              onPromptChange={handlePromptChange}
              onSend={sendPromptToAssistant}
              loading={loading}
            />
            <ChatBox 
              messages={messages} 
              input={input} 
              setInput={setInput} 
              onSend={sendMessage} 
              isTyping={isTyping} 
              assistantName={assistantName} 
              messagesEndRef={messagesEndRef}
            />
          </div>
          <ConfirmationDialog
            open={showConfirmation}
            onConfirm={confirmAssistantChange}
            onCancel={() => setShowConfirmation(false)}
            assistantName={pendingAssistant?.name}
          />
        </div>
      )}
    </div>
  );
}

export default ChatPrueba;