import { DateApp } from '../gui/DateApp.js';
import { FileManager } from '../gui/FileManager.js';
import { Calculator } from '../gui/Calculator.js';
import { Notepad } from '../gui/Notepad.js';
import { Terminal } from '../../shell/Terminal.js';
import { SnakeGame } from '../gui/SnakeGame.js';
import { MemoryGame } from '../gui/MemoryGame.js';
import { Paint } from '../gui/Paint.js';
import { MusicPlayer } from '../gui/MusicPlayer.js';
import { ShawMe } from '../gui/Shawme.js';
import { CodeEditor } from '../gui/CodeEditor.js';

const Apps = {
    'date': DateApp,
    'files': FileManager,
    'calculator': Calculator,
    'notepad': Notepad,
    'terminal': Terminal,
    'snake': SnakeGame,
    'memory': MemoryGame,
    'paint': Paint,
    'music': MusicPlayer,
    'shawme': ShawMe,
    'code-editor': CodeEditor,
}

export default Apps;