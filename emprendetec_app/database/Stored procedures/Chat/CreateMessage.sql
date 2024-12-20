--------------------------------------------------------------------------
-- Author:       Fabián Vargas
-- Date:         17/05/2024
-- Description:  Creates a message
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_CreateMessage]
    @IN_SenderId INT,
    @IN_MessageBody NVARCHAR(255),
    @IN_ChatID INT

AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @MessageId INT;
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
    FROM [dbo].[Chats]
    WHERE   [chatId] = @IN_ChatID
        )
        BEGIN
        RAISERROR('El chat no existe.', 16, 1);
    END;

        -- START TRANSACTION
        IF @@TRANCOUNT = 0
        BEGIN
        SET @transactionStarted = 1;
        BEGIN TRANSACTION;
    END;

       
        -- Insert the message into the 'messages' table
        INSERT INTO [dbo].[Messages]
        (
        [fromUserId],
        [messageBody],
        [chatId],
        [timestamp]
        )
    VALUES
        (
            @IN_SenderId,
            @IN_MessageBody,
            @IN_ChatID,
            GETUTCDATE()
        );

        -- Get the message ID
        SET @MessageId = SCOPE_IDENTITY();

         SELECT
        m.messageId,
        m.messageBody,
        m.timestamp,
        u.userId,
        u.givenName,
        u.familyName,
        u.email,
        u.profilePictureUrl
    FROM
        Messages m
        INNER JOIN Users u ON m.fromUserId = u.userId
    WHERE 
        m.messageId = @MessageId

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