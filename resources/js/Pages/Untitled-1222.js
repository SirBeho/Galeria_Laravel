const handlePrevious = (e) => {
    e.stopPropagation();
    if (current > 0) {
      const previousIndex = current - 1;
      setCurrent(previousIndex);
      addImageDiv(previousIndex);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (current < images.length - 1) {
      const nextIndex = current + 1;
      setCurrent(nextIndex);
      addImageDiv(nextIndex);
    }
  };

  const addImageDiv = (index) => {
    const newDiv = document.createElement("div");
    newDiv.className = `${maxWidthClass} bg-white absolute right-1/2 translate-x-full scale-75 opacity-0 p-6 mb-6 rounded-lg shadow-xl transform transition-all duration-1000 sm:w-full sm:mx-auto`;

    newDiv.innerHTML = `
      <button onClick=${close} class="px-2 font-bold hover:bg-gray-300 rounded-lg absolute right-2 top-2">x</button>
      <h5 class="text-xl font-bold text-center pb-2">${header}</h5>
      <h1>${images[index]}</h1>
      <div class="border overflow-hidden">
        <div class="flex max-h-screen h-full bg-white w-full transition ease-out duration-40">
          <div class="block min-w-full w-full rounded-3xl overflow-hidden">
            <div class="w-full h-full">
              <img class="h-full object-contain w-full" src="/images/${images[index]}" alt="Descripción" />
            </div>
          </div>
        </div>
      </div>
    `;

    containerRef.current.appendChild(newDiv);

    setTimeout(() => {
      newDiv.classList.remove("translate-x-full");
      newDiv.classList.remove("scale-75");
      newDiv.classList.remove("opacity-0");
      newDiv.classList.add("translate-x-1/2");
    }, 10);
  };