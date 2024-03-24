#Only recommended for testing before building the docker image
#
FROM node:alpine
RUN apk update && apk upgrade && apk add yarn && apk add bash 
WORKDIR /usr/src/app
# RUN mkdir .yarn
COPY .yarn /usr/src/app/.yarn
COPY .yarnrc.yml /usr/src/app/.yarnrc.yml
RUN npm install -g npm@latest
RUN npm install -g typescript nodemon -y
# RUN yarn set version berry
EXPOSE 3000
EXPOSE 80
EXPOSE 443
# CMD [ "ls"]
CMD ["bash","./dev-buildserver.sh" ]

