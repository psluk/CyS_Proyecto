--------------------------------------------------------------------------
-- Author:       Jasson Segura Jimenez
-- Date:         2024-03-26
-- Description:  Gets the details of a user
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[GetUserDetails]
AS
BEGIN
	DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
	DECLARE @transactionStarted BIT = 0;
	BEGIN TRY
		SELECT u.givenName + ' ' + u.familyName AS FullName,
			   u.signUpTimestamp AS RegistrationDate,
			   u.rating AS Score,
               u.email AS Email
		FROM Users u
        WHERE u.userTypeId != 1; -- Select only users with userTypeId different from 1
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
