import React from 'react';
import Loading from '../components/Loading';

function AssistantBox({ assistantInput, onPromptChange, onSend, loading }) {
  return (
    <div className="assistant-box">
      <textarea
        value={assistantInput}
        onChange={onPromptChange}
        placeholder="Agrega instrucciones adicionales para el asistente"
      />
      <button onClick={onSend} style={{ fontWeight: 'bold', marginTop: '5px' }}>ENVIAR A ASISTENTE</button>
      {loading && <Loading />}
    </div>
  );
}

export default AssistantBox;
