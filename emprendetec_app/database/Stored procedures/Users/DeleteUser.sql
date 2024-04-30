--------------------------------------------------------------------------
-- Author:       Jasson Segura Jimenez
-- Date:         2024-03-26
-- Description:  Deletes a user from the database
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_DeleteUser]
    -- Parameters
    @IN_email VARCHAR(255), -- Puede ser un solo correo electrónico o una lista separada por comas de correos electrónicos
    @DeleteMultiple BIT = 0 
AS
BEGIN
    SET NOCOUNT ON;         -- Do not return metadata
    DECLARE @UserId INT;
    
    -- Inicializar la variable de retorno
    DECLARE @ReturnValue INT = 0; -- Por defecto, no se eliminó ningún usuario

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    -- 

    BEGIN TRY

        -- VALIDATIONS
        --

        -- START TRANSACTION
        IF @@TRANCOUNT = 0
        BEGIN
            SET @transactionStarted = 1;
            BEGIN TRANSACTION;
        END;
        IF @DeleteMultiple = 1
        BEGIN
            DELETE FROM [dbo].[Users]
            WHERE [email] IN (SELECT value FROM STRING_SPLIT(@IN_email, ','));
        END
        ELSE 
        BEGIN
            SELECT @UserId = [userId]
            FROM [dbo].[Users]
            WHERE [email] = @IN_email;

            IF @UserId IS NOT NULL
            BEGIN
                DELETE FROM [dbo].[Users]
                WHERE [userId] = @UserId;
            END
        END;
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