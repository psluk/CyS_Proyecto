--------------------------------------------------------------------------
-- Author:       Fabián Vargas
-- Date:         17/05/2024
-- Description:  Creates a chat
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_CreateChat]
    @IN_SenderId INT,
    @IN_ReceiverId INT,
    @IN_MessageBody NVARCHAR(255)

AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @chatId INT;

    BEGIN TRY

        -- VALIDATIONS
        IF NOT EXISTS
        (
            SELECT 1
    FROM [dbo].[Users]
    WHERE   [userId] = @IN_SenderId
        )
        BEGIN
        RAISERROR('El usuario remitente no existe.', 16, 1);
    END;

        IF NOT EXISTS
        (
            SELECT 1
    FROM [dbo].[Users]
    WHERE   [userId] = @IN_ReceiverId
        )
        BEGIN
        RAISERROR('El usuario destinatario no existe.', 16, 1);
    END;

        -- START TRANSACTION
        IF @@TRANCOUNT = 0
        BEGIN
        SET @transactionStarted = 1;
        BEGIN TRANSACTION;
    END;

        -- Insert the chat into the 'chats' table
        INSERT INTO Chats
    DEFAULT VALUES;

        SELECT @chatId = SCOPE_IDENTITY();

        -- Insert the chat into the 'chatUsers' table

        INSERT INTO [dbo].[ChatUsers]
        (
        [chatId],
        [userId]
        )
    VALUES
        (
            @chatId,
            @IN_SenderId
        );

        INSERT INTO [dbo].[ChatUsers]
        (
        [chatId],
        [userId]
        )
    VALUES
        (
            @chatId,
            @IN_ReceiverId
        );

        -- Insert the message into the 'messages' table
        INSERT INTO [dbo].[Messages]
        (
        [chatId],
        [fromUserId],
        [messageBody],
        [timestamp]
        )
    VALUES
        (
            @chatId,
            @IN_SenderId,
            @IN_MessageBody,
            GETUTCDATE()
        );

        SELECT COALESCE(
    (
        SELECT
            c.chatId AS 'chat.id',
            (SELECT
                u.userId AS 'user.userId',
                u.givenName AS 'user.givenName',
                u.familyName AS 'user.familyName',
                u.email AS 'user.email',
                u.profilePictureUrl AS 'user.profilePictureUrl'
             FROM ChatUsers cu
             INNER JOIN Users u ON cu.userId = u.userId
             WHERE cu.chatId = c.chatId
             FOR JSON PATH) AS 'chat.users',
            (SELECT
                m.messageId AS 'message.messageId',
                m.messageBody AS 'message.messageBody',
                m.timestamp AS 'message.timestamp',
                m.fromUserId AS 'message.senderId',
                u.givenName AS 'message.senderGivenName',
                u.familyName AS 'message.senderFamilyName',
                u.email AS 'message.senderEmail'
             FROM Messages m
             INNER JOIN Users u ON m.fromUserId = u.userId
             WHERE m.chatId = c.chatId
             ORDER BY m.timestamp
             FOR JSON PATH) AS 'chat.messages',
            MAX(m.timestamp) AS 'lastMessageTimestamp'
        FROM Chats c
        LEFT JOIN Messages m ON m.chatId = c.chatId
        WHERE EXISTS (
            SELECT 1
            FROM ChatUsers
            WHERE chatId = c.chatId
        ) AND c.chatId = @chatId
        GROUP BY c.chatId
        ORDER BY 'lastMessageTimestamp' DESC
        FOR JSON PATH
    ),
    '[]'
) AS 'results';

        -- COMMIT TRANSACTION
        IF @transactionStarted = 1
        BEGIN
        COMMIT TRANSACTION;
    END;

    END TRY
    BEGIN CATCH

        SET @ErrorNumber = ERROR_NUMBER();
        SET @ErrorSeverity = ERROR_SEVERITY();
        SET @ErrorState = ERROR_STATE();
        SET @Message = ERROR_MESSAGE();

        IF @transactionStarted = 1
        BEGIN
        ROLLBACK;
    END;

        IF @ErrorNumber != 50000
        BEGIN
        -- If it's not a custom error, log the error
        INSERT INTO [dbo].[Errors]
        VALUES
            (
                SUSER_NAME(),
                ERROR_NUMBER(),
                ERROR_STATE(),
                ERROR_SEVERITY(),
                ERROR_LINE(),
                ERROR_PROCEDURE(),
                ERROR_MESSAGE(),
                GETUTCDATE()
            );
    END;

        RAISERROR('%s - Error Number: %i', 
            @ErrorSeverity, @ErrorState, @Message, @ErrorNumber);

    END CATCH;
END;