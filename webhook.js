import XMLHttpRequest from 'xhr2';

export function sendMessage(url, params) {
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(params));
  console.log(request.responseText);
}