import React, { useState, useEffect } from 'react';
import BWbtn from "@/components/BWbtn";
import SvgBtn from "@/components/SvgBtn";
import Image from 'next/image';

const Searchbar = (props) => {
  const [showingChoices, setShowingChoices] = useState(false);
  const [folderPaths, setFolderPaths] = useState([]);
  const [newPath, setNewPath] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);


  const handleMouseEnter = () => {
    setShowingChoices(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setShowingChoices(false);
    }, 1000); 
    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  useEffect(() => {
    const storedPaths = JSON.parse(localStorage.getItem('folderPaths')) || [];
    setFolderPaths(storedPaths);
    
  }, []);

  useEffect(() => {
    if(folderPaths.length > 0) {
    localStorage.setItem('folderPaths', JSON.stringify(folderPaths));
    }
  }, [folderPaths]);

  const showChoices = () => {
    setShowingChoices(!showingChoices);
  };

  const addFolderPath = () => {
    if (newPath.trim() === "") return; 
    setFolderPaths(prevPaths => {
      const updatedPaths = [newPath, ...prevPaths.filter(path => path !== newPath)]; 

      return updatedPaths.slice(0, 10); 
    });
    setNewPath(""); 
  };

  const handlePathChange = (e) => {
    setNewPath(e.target.value); 
  };

  const deleteFolderPath = (path) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${path}"?`);
    if (confirmDelete) {
      setFolderPaths(prevPaths => prevPaths.filter(p => p !== path));

    }
  };

  const handleLongClick = (path) => {
    const timer = setTimeout(() => deleteFolderPath(path), 2000); 
    return () => clearTimeout(timer); 
  };

  return (
    <div className='absolute w-full z-50'>
      <div className="py-3 relative z-20 px-5 flex justify-between items-center">
        <div className="left flex items-center">
          <div className="searchBar mx-3 flex items-center gap-1 bg-stone-700 rounded-full">
            <div className='flex items-center'>
              <div className='h-8 w-8 flex items-center justify-center ml-2'>
                <Image src="/search.svg" alt="search" className='w-6 h-6' width={180} height={180} />
              </div>
            </div>
            <input
              type="text"
              className='rounded-full py-2 px-3 min-w-80 max-w-fit text-base border-none outline-none bg-transparent'
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="right flex items-center gap-2">
          <BWbtn text="Explore Premium" theme="light" />
          <BWbtn text="Install App" theme="dark" />
          <SvgBtn d="M8 1.5a4 4 0 0 0-4 4v3.27a.75.75 0 0 1-.1.373L2.255 12h11.49L12.1 9.142a.75.75 0 0 1-.1-.374V5.5a4 4 0 0 0-4-4zm-5.5 4a5.5 5.5 0 0 1 11 0v3.067l2.193 3.809a.75.75 0 0 1-.65 1.124H10.5a2.5 2.5 0 0 1-5 0H.957a.75.75 0 0 1-.65-1.124L2.5 8.569V5.5zm4.5 8a1 1 0 1 0 2 0H7z" />
          <span onClick={showChoices} className="bg-stone-700 bg-opacity-50 p-1 rounded-full">
            <span className="rounded-full w-6 h-6 flex items-center justify-center font-medium bg-[#f573a0] text-black leading-6">D</span>
          </span>

          {showingChoices && (
            <div className="absolute top-16 flex flex-col px-3 right-5 bg-stone-700 p-4 rounded-lg w-96">
              <div>
                <input
                  type="text"
                  className="bg-stone-700 border outline-none rounded-full p-2 w-[calc(100%-62px)] px-5"
                  placeholder="folderpath"
                  value={newPath}
                  onChange={handlePathChange}
                />
                <button className='bg-[#73f57e] px-3 py-2 ml-2 rounded-full max-w-fit' onClick={addFolderPath}>
                  Add
                </button>
              </div>
              <ul className="flex flex-col gap-2 w-full " onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <p className='py-3'>Folders:</p>
                {folderPaths.map((path, index) => (
                  <li
                    key={index}
                    className="text-white cursor-pointer flex justify-between items-center hover:bg-stone-800 p-2 rounded-lg" 
                    onClick={() => props.setFolderPath(path)}
                  >
                    <div className='max-w-[calc(100%-70px)] overflow-x-hidden text-ellipsis break-words'>
                    {path}
                    </div>
                    <span
                      className="bg-red-500 text-white px-2 py-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolderPath(path);
                        

                      }}
                      onContextMenu={(e) => {
                        e.stopPropagation();
                        handleLongClick(path);
                      }}
                      
                    >delete</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
