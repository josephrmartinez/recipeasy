

// - Bug fix: sync animate pulse to new item load
// - Customize cubic bezier on animate pulse 

// const [loadingIndex, setLoadingIndex] = useState(0);

//   const loadingStatements = [
//   "Searching for the recipe online...",
//   "Sifting through all the SEO content...",
//   "This could be a good option...",
//   "Dodging all the popup ads...",
//   "Skimming through the stories...",
//   "Closing a video...",
//   "Skipping over a banner ad...",
// ];

//   // a useEffect hook that updates the loadingIndex state variable every two seconds, causing the loading statements to change:
//   useEffect(() => {
//   const intervalId = setInterval(() => {
//     setLoadingIndex((prevIndex) => (prevIndex + 1) % loadingStatements.length);
//   }, 4000);
//   return () => clearInterval(intervalId);
//   }, []);


//   <p className="text-black mt-3 text-sm animate opacity-0 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
//         {loadingStatements[loadingIndex]}
//         </p>
