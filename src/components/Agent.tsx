import { Bot } from 'lucide-react';

type AgentProps = {
  userName: string;
}

const CallStatus = {
  INACTIVE: 'INACTIVE',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
} as const;



const messages = [
  "whats your name?",
  "My name is AIer, nice to meet you!",
];

const lastMessage = messages[messages.length - 1];

type CallStatus = (typeof CallStatus)[keyof typeof CallStatus];

const getCallStatus = (): CallStatus => CallStatus.ACTIVE;

const Agent: React.FC<AgentProps> = ({ userName = "You" }) => {
  const callStatus = getCallStatus();
  const isSpeaking = true;
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row gap-8">
        <div className="flex flex-col border border-white rounded-lg w-100 h-40">
          <div className="flex justify-center items-center w-full h-1/2 avatar">
            <Bot size={48} className="text-white" />
            {isSpeaking && <span className="animate-speak" />}
          </div>

          <div className="flex justify-center items-center w-full h-1/2 ">
            <h3 className="text-white">AI Interviewer</h3>
          </div>

        </div>

        <div className="flex flex-col border border-white rounded-lg w-100 h-40">
          <div className="flex justify-center items-center w-full h-1/2 avatar">
            <Bot size={48} className="text-white" />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <div className="flex justify-center items-center w-full h-1/2 ">
            <h3 className="text-white">{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="w-full h-full flex items-center justify-center">
          <p className="transition-opacity duration-300 text-white animate-fade-in opacity-100">
            {lastMessage}
          </p>
        </div>
      )}
      {callStatus === CallStatus.CONNECTING ? (
        <p className="text-white">Connecting...</p>
      ) : (
        <button className="text-white">End</button>
      )}
    </div>
  )
}

export default Agent