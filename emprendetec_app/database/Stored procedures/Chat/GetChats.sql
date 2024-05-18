--------------------------------------------------------------------------
-- Author:       Fabián Vargas
-- Date:         17/05/2024
-- Description:  Returns the chats of the user
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_GetChats]
    @IN_Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @userId INT;

    BEGIN TRY

        -- VALIDATIONS
        IF NOT EXISTS
        (
            SELECT 1
    FROM [dbo].[Users]
    WHERE   [email] = @IN_Email
        )
        BEGIN
        RAISERROR('El usuario no existe.', 16, 1);
    END;

        SELECT @userId = [userId]
    FROM [dbo].[Users]
    WHERE [email] = @IN_Email;

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
             FOR JSON PATH) AS 'chat.messages'
        FROM Chats c
        WHERE EXISTS (SELECT 1 FROM ChatUsers WHERE chatId = c.chatId AND userId = @userId)  -- Asumiendo @userId es proporcionado
        FOR JSON PATH
    ),
    '[]'
) AS 'results';

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