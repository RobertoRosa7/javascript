onmessage = (e) => handlerWorker(e);

function handlerWorker(e) {
  postMessage(e.data);
}
