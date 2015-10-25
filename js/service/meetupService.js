'use strict';
scooter.factory( 'meetupService', function( $http ){
    var eventsUrl = "https://api.meetup.com/2/events?key={key}&group_urlname={name}&time={time}&callback=JSON_CALLBACK";
    var attendeeUrl = "https://api.meetup.com/2/rsvps?key={key}&event_id={eventId}&callback=JSON_CALLBACK";
    var eldersUrl = "https://api.meetup.com/2/profiles?key={key}&group_urlname={name}&role=leads&callback=JSON_CALLBACK";

    this.retrieveEvent = function(apiKey, groupName, meetupDate ){
        var url = eventsUrl.replace('{key}', apiKey, meetupDate).replace('{name}', groupName);

        var epochTime = Date.parse(meetupDate);
        url = url.replace('{time}', epochTime + ',' + (epochTime+86400000));

        return $http.jsonp(url).then( function retrieveUpcomingEventsCallback(events){
            if(events.status !== 200 || (events.data.status && events.data.status !== 200)){
                throw events.data;
            }

            if(events.data.results && events.data.results.length !== 1 ){
                throw {
                  problem : 'Wrong number of events found for this group and date - ' + events.data.results.length
                };
            }

            return events.data.results[0];
        });
    };

    this.retrieveAttendees = function(apiKey, eventId){
        var url = attendeeUrl.replace('{key}', apiKey).replace('{eventId}', eventId);

      return $http.jsonp(url).then( function retrieveAttendessCallback(attendees){
          if(attendees.status !== 200 || (attendees.data.status && attendees.data.status !== 200)){
              throw events.data;
          }

          return attendees.data.results;
      });
    };

    return this;
});