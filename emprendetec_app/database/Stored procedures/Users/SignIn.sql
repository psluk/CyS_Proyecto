--------------------------------------------------------------------------
-- Author:       Paúl Rodríguez García
-- Date:         2024-03-26
-- Description:  Returns the user's basic information after they sign in
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_Users_SignIn]
    -- Parameters
    @IN_firebaseUid     VARCHAR(128)
AS
BEGIN
    SET NOCOUNT ON;         -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @userId INT;

    BEGIN TRY

        -- VALIDATIONS
        
        -- Check if the user exists
        SELECT  @userId = U.[userId]
        FROM    [dbo].[Users] U
        WHERE   U.[firebaseUid] = @IN_firebaseUid;

        -- If the user does not exist, return an error
        IF @userId IS NULL
        BEGIN
            RAISERROR('El usuario no existe.', 16, 1);
        END;

        -- Otherwise, return the user's basic information
        SELECT  UT.[roleName]   'userType',
                U.[givenName]   AS givenName,
                U.[familyName]  AS familyName,
                U.[email]       AS email
        FROM    [dbo].[Users] U
        JOIN    [dbo].[UserTypes] UT
            ON  U.[userTypeId] = UT.[userTypeId]
        WHERE   U.[userId] = @userId;

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
            VALUES (
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