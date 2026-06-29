import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateRoomView } from './presentation/views/CreateRoomView';
import { MatchView } from './presentation/views/MatchView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateRoomView />} />
        <Route path="/room/:roomId" element={<MatchView />} />
      </Routes>
    </BrowserRouter>
  );
}
