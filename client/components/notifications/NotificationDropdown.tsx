"use client";

import {
  Inbox,
  UserPlus,
  Check,
  X,
} from "lucide-react";

import {
  acceptInvitation,
  rejectInvitation,
} from "@/services/invitation.service";

import {
  useNotification,
} from "@/hooks/useNotificationStore";

export default function NotificationDropdown() {

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotification();


  const handleAcceptInvitation = async (
    notificationId: string,
    invitationId: string
  ) => {

    try {

      await acceptInvitation(
        invitationId
      );

      // Mark notification as read
      markAsRead(
        notificationId
      );

      // Remove notification after successful action
      removeNotification(
        notificationId
      );

      console.log(
        "✅ Invitation accepted"
      );

    } catch (error) {

      console.error(
        "❌ Failed to accept invitation:",
        error
      );

    }
  };


  const handleRejectInvitation = async (
    notificationId: string,
    invitationId: string
  ) => {

    try {

      await rejectInvitation(
        invitationId
      );

      // Mark notification as read
      markAsRead(
        notificationId
      );

      // Remove notification after successful action
      removeNotification(
        notificationId
      );

      console.log(
        "✅ Invitation rejected"
      );

    } catch (error) {

      console.error(
        "❌ Failed to reject invitation:",
        error
      );

    }
  };


  return (
    <div
      className="
        absolute
        right-0
        top-12
        z-50
        w-80
        overflow-hidden
        rounded-xl
        border
        bg-background
        shadow-xl
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          px-4
          py-3
        "
      >

        <h3 className="font-semibold">
          Notifications
        </h3>

        {notifications.some(
          (notification) =>
            !notification.read
        ) && (

          <button
            type="button"
            onClick={markAllAsRead}
            className="
              text-xs
              text-primary
              hover:underline
            "
          >
            Mark all as read
          </button>

        )}

      </div>


      {/* Notifications */}

      <div className="max-h-96 overflow-y-auto">

        {notifications.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-6
              py-10
              text-center
              text-muted-foreground
            "
          >

            <Inbox
              className="
                mb-2
                h-8
                w-8
              "
            />

            <p className="text-sm">
              No notifications
            </p>

          </div>

        ) : (

          notifications.map(
            (notification) => {

              const isProjectInvitation =
                notification.type ===
                "PROJECT_INVITATION";


              const invitationId =
                notification.data?.invitationId;


              return (

                <div
                  key={notification.id}
                  onClick={() => {

                    if (
                      !notification.read
                    ) {
                      markAsRead(
                        notification.id
                      );
                    }

                  }}
                  className={`
                    border-b
                    px-4
                    py-3
                    transition
                    hover:bg-muted/50
                    ${
                      !notification.read
                        ? "bg-muted/30"
                        : ""
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      gap-3
                    "
                  >

                    {/* Icon */}

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-primary/10
                      "
                    >

                      <UserPlus
                        className="
                          h-4
                          w-4
                          text-primary
                        "
                      />

                    </div>


                    {/* Content */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <p className="text-sm">
                        {notification.message}
                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-muted-foreground
                        "
                      >
                        Project invitation
                      </p>


                      {/* Invitation Actions */}

                      {isProjectInvitation &&
                        invitationId && (

                          <div
                            className="
                              mt-3
                              flex
                              gap-2
                            "
                          >

                            <button
                              type="button"
                              onClick={(event) => {

                                event.stopPropagation();

                                handleAcceptInvitation(
                                  notification.id,
                                  invitationId
                                );

                              }}
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                bg-primary
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-primary-foreground
                                hover:opacity-90
                              "
                            >

                              <Check
                                className="
                                  h-3
                                  w-3
                                "
                              />

                              Accept

                            </button>


                            <button
                              type="button"
                              onClick={(event) => {

                                event.stopPropagation();

                                handleRejectInvitation(
                                  notification.id,
                                  invitationId
                                );

                              }}
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                border
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                hover:bg-muted
                              "
                            >

                              <X
                                className="
                                  h-3
                                  w-3
                                "
                              />

                              Reject

                            </button>

                          </div>

                        )}

                    </div>


                    {/* Unread indicator */}

                    {!notification.read && (

                      <span
                        className="
                          mt-2
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          bg-primary
                        "
                      />

                    )}

                  </div>

                </div>

              );

            }
          )

        )}

      </div>

    </div>
  );
}