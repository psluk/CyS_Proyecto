--------------------------------------------------------------------------
-- Author:       Fabián Vargas
-- Date:         2024-29-04
-- Description:  Returns the top 6 users with most score
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_TopUsers]
-- Parameters
AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION


    BEGIN TRY

        SELECT TOP 6
        u.[userId],
        u.[givenName],
        u.[familyName],
        u.[email],
        u.[rating],
        u.[profilePictureUrl]

    FROM
        [dbo].[Users] u
    ORDER BY
            u.[rating] DESC;

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