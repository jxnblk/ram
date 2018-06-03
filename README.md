
# RAM
## React App Manager

**BETA**

Create and run React applications – no command line or build setup required.
Powered by [Electron][electron] & [Create React App][cra]

<img src='docs/demo.gif' />

## Getting started

RAM requires Node.js v6 and npm v5.2 or later to be installed on your computer.
Install the latest version of Node.js (which includes npm) here:

- [Install Node.js][node]

<!--
[Download][download]

[download]:
-->

## Motivation

I'm a firm believer in code literacy,
and I've worked with many people throughout my career who have strong development skills with languages like HTML and CSS,
but who might face barriers to entry with modern front-end development tools.
When I think about the potential barriers to entry, a few things come to mind:

1. Scaffolding a full React (or similar) application requires a bit of setup
2. The terminal and command line interfaces can be intimidating at first
3. Node.js and npm can be foreign concepts to people new to front-end development

For the most part, [Create React App][cra] has solved #1 for people who already know #2 and #3.
It's an excellent tool and that's why RAM makes use of it.

RAM is aimed at abstracting away the terminal and npm aspects for beginners.
If you're a professional front-end developer, I'd recommend using the command line tools directly instead of an application like this,
as it's a very valuable and powerful skillset to utilize.
If you do make use of this app, hopefully it can serve as a learning tool and can make some of these things less intimidating as you progress.

Remember: **GUIs will never be as efficient or powerful as CLIs**

## How it works

All the magic comes from the underlying command line interfaces: [npm][npm] and [create-react-app][cra].
This application uses [Electron][electron] to spawn child processes that run the commands to power these tools.
The logs from stdio are passed back to the application for display.
See the [`renderer/spawn.js`](renderer/spawn.js) and [`renderer/CreateForm.js`](renderer/CreateForm.js) modules for an example of how this works.

### Alternative approaches

Some alternatives to this particular Electron setup include:

- Server running directly in electron
- Using [zeit/pkg][pkg] with a web interface

## Caveats

- Requires Node.js v6+ and npm v5.2+
- Built in a few hours
- No tests
- Expects the port to be `3000`
- Not tested on Linux or Windows


## Alternatives

- [Compositor Iso][iso] is a similar project aimed at solving a similar problem
- Use [Create React App][cra] directly
- [CodeSandbox][sandbox] is great for quick prototypes and demos with shareable URLs
- Unknown/unreleased project by [Josh Comeau](https://mobile.twitter.com/JoshWComeau/status/1003060061113995264)


## Roadmap

- [ ] Abstract create form to a more general purpose utility
- [ ] Refactor React component architecture where needed
- [ ] Configurable `port` option
- [ ] npm depencendy management
- [ ] Add support for [create-next-app](https://github.com/segmentio/create-next-app), [gatsby-cli](https://github.com/gatsbyjs/gatsby), etc.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Development

Install dependencies and start the app:

```sh
npm i && npm start
```

The `main` folder contains modules for the main process,
and `renderer` includes all files for the renderer process.
No Babel transpilation is used, so be sure to use Electron-compatible syntax

[MIT License](LICENSE.md)

[iso]: https://github.com/c8r/iso
[electron]: https://github.com/electron/electron
[cra]: https://github.com/facebook/create-react-app
[npm]: https://github.com/npm/npm
[node]: https://nodejs.org/en/
[pkg]: https://github.com/zeit/pkg
[sandbox]: https://codesandbox.io

