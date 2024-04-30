--------------------------------------------------------------------------
-- Author:       Jasson Segura Jimenez
-- Date:         2024-04-11
-- Description:  updates an entrepreneurship post
--------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_UpdateEntrepreneurship]
    -- Parameters
    @IN_projectID INT,
	@IN_projectName NVARCHAR(50),
    @IN_description NVARCHAR(255),
    @IN_userEmail NVARCHAR(255),
    @IN_location NVARCHAR(255),
    @IN_latitude FLOAT,
    @IN_longitude FLOAT,
    @IN_images NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    BEGIN TRY
        -- VALIDATIONS
        IF NOT EXISTS
        (
            SELECT  1
            FROM    [dbo].[Posts]
            WHERE   [postId] = @IN_projectID
        )
        BEGIN
            RAISERROR('El proyecto que estas tratanto de modificar no existe.', 16, 1);
        END;

        DECLARE @userId INT;
        SELECT @userId = [userId] FROM [dbo].[Users] WHERE [email] = @IN_userEmail;

        -- START TRANSACTION
        IF @@TRANCOUNT = 0
        BEGIN
            SET @transactionStarted = 1;
            BEGIN TRANSACTION;
        END;

        -- Insert the project into the 'posts' table
        UPDATE [dbo].[Posts]
        SET [title] = @IN_projectName,
            [description] = @IN_description,
            [location] = @IN_location,
            [locationX] = @IN_longitude,
            [locationY] = @IN_latitude
        WHERE [postId] = @IN_projectID;

		DECLARE @imageTable TABLE (ImageUrl NVARCHAR(255));
		INSERT INTO @imageTable (ImageUrl)
		SELECT value FROM STRING_SPLIT(@IN_images, ',');

        UPDATE [dbo].[postimages]
        SET [postId] = @IN_projectID,
            [imageUrl] = ImageUrl
        SELECT @projectId,  ImageUrl FROM @imageTable
        WHERE [postId] = @IN_projectID;

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
                GETDATE()
            );
        END;

        RAISERROR('%s - Error Number: %i', 
            @ErrorSeverity, @ErrorState, @Message, @ErrorNumber);

    END CATCH;
END;