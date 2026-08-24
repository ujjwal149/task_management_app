import {
  sendToUser,
} from "../websocket/websocket.server";

import {
  WS_EVENTS,
} from "../websocket/events";



//------------------PROJECT INVITATION-------------------//

export const notifyProjectInvitation = (
  userId: string,
  data: {

    invitationId: string;

    projectId: string;
    projectName: string;

    invitedBy: {
      id: string;
      name: string;
    };

    role: string;
  }
) => {

  sendToUser(
    userId,
    WS_EVENTS.PROJECT_INVITATION,
    data
  );

};