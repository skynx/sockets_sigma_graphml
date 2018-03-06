# Sockets, Sigma.js, and GraphML

*Isn't it hard* to see what's going on in your XML representations of
networks?  *Tossing and Turing*, wondering *where it all went wrong*?

WELL NOW YOU CAN.

*Introducing*: a minimal example of using sigma.js to draw graphs that
come in off a WebSocket in graphml form!

Satisfaction not guaranteed, twiddle to your heart's content.

## why?

For fun!  And because I wanted to be able to quickly visualize the
output from
[DistrictDataLabs/tribe](https://github.com/DistrictDataLabs/tribe)
without a lot of GUI overhead.

## using this example

Before you start, make sure you have sigma.js and graphml-js
installed.  Note also that `simple.html` is looking for the file
`bundle.js`; this is the output of the following browserify command.

```
browserify -t brfs simple_sigma.js -o bundle.js
```

Get the websocket broadcasting utility `wsb` with `npm i -g wsb`, then
start a broadcast websocket on port 9090 as follows.

```
PORT=9090 wsb 
```

Next, start a `python -m SimpleHTTPServer 8000` in this directory and
open the page `simple.html`.

Finally, get your favorite graphml file and transmit it to the
broadcast port, like this:

```
cat primer.graphml | wscat ws://localhost:9090
```


If everything went according to plan, a network will now be drawn in
your broswer window.  You can fiddle with it using the console,
*e.g.*:

```
s.startNoverlap()
```


## THE END.
