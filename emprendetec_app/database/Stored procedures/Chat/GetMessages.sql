--------------------------------------------------------------------------
-- Author:       Fabián Vargas
-- Date:         17/05/2024
-- Description:  Returns the messages of a chat
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_GetMessages]
    @IN_ChatID NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION

    BEGIN TRY

        -- VALIDATIONS
        IF NOT EXISTS
        (
            SELECT 1
            FROM [dbo].[Chats]
            WHERE   [chatId] = @IN_ChatID
        )
        BEGIN
            RAISERROR('El chat no existe.', 16, 1);
        END;


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
        m.chatId = @IN_ChatID
        ORDER BY 
        m.timestamp ASC;

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