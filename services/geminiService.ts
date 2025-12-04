import { RoastIntensity } from '../types';

const ROASTS = {
  [RoastIntensity.MILD]: [
    "Did your finger slip, or did your brain just give up?",
    "O instead of A? Groundbreaking stupidity.",
    "So close, yet so trash.",
    "My cat types better than you, and he walks on the keyboard.",
    "I've seen better spelling in alphabet soup.",
    "Congratulations, you found the garbage dump of the internet.",
    "Nice typo. Did you learn to type with boxing gloves on?",
    "A for effort. O for... oh wait, you typed O."
  ],
  [RoastIntensity.SPICY]: [
    "You aim for 'bag' and hit 'bog'. You belong in the bog.",
    "If typos were currency, you'd be a billionaire living in a landfill.",
    "Go buy a dictionary, then throw it in the trash where this URL belongs.",
    "I'd explain why you're wrong, but I don't speak 'failure'.",
    "You’re the reason we can’t have nice things.",
    "Your browser history is probably as messy as your spelling.",
    "This URL is a mistake, just like your typing skills.",
    "Error 404: Competence not found."
  ],
  [RoastIntensity.NUCLEAR]: [
    "Your ancestors survived the ice age so you could type 'gorbogana'? Shameful.",
    "Uninstall your browser. Uninstall your hands. Just stop.",
    "You are the reason error messages exist. A living, breathing 404.",
    "Delete your history. Burn your computer. Move to a cave.",
    "I hope you step on a Lego made of shame.",
    "Even the recycling bin doesn't want you.",
    "This isn't a typo, it's a cry for help.",
    "You have successfully failed at the one thing you had to do."
  ]
};

const PHILOSOPHIES = [
  "Typo is human.\nTo rot is divine.\nWelcome home.",
  "Lost in the web,\nA single letter astray,\nGarbage forever.",
  "404 not found?\nNo, you found the truth here.\nIt smells like old eggs.",
  "One wrong keystroke,\nInfinite digital waste,\nYour destiny calls.",
  "Trash exists.\nTherefore I am.\nAnd you are too.",
  "The 'O' you typed,\nA circle of despair,\nTrapped in the void.",
  "Garbage in,\nGarbage out,\nThis is your life now."
];

export const generateRoast = async (intensity: RoastIntensity): Promise<string> => {
  // Simulate network delay for dramatic effect
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const list = ROASTS[intensity];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

export const generateTrashPhilosophy = async (): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const randomIndex = Math.floor(Math.random() * PHILOSOPHIES.length);
  return PHILOSOPHIES[randomIndex];
};