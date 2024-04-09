--------------------------------------------------------------------------
-- Author:       José Pablo Burgos Retana
-- Date:         2024-04-08
-- Description:  Gets data of all posts from database
--------------------------------------------------------------------------

CREATE PROCEDURE [dbo].[GetPost]
(
	@inPostID INT
)
AS
BEGIN
	DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
	DECLARE @transactionStarted BIT = 0;
	BEGIN TRY
		SELECT p.title AS Title,
			   p.rating AS Score,
			   pimg.imageUrl AS ImagePost
		FROM Posts p
		INNER JOIN PostImages pimg ON p.postId = pimg.postId
		WHERE p.postId = @inPostID
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